package com.teamf.college0.utils.seeders;


import com.teamf.college0.domain.user.account.UserAccountRepository;
import com.teamf.college0.domain.user.account.entity.UserAccount;
import io.jsonwebtoken.security.Password;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile({"first_run"})
public class DataSeeder implements CommandLineRunner {
    @Autowired
    private UserAccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        System.out.println("Starting Data Seeding!");
        seedRegistrar("registrar1", "Karol", "Kopciuch");
        seedRegistrar("registrar2", "Marcus", "Coppa");
        seedRegistrar("registrar3", "Momoka", "Yonashiro");
        System.out.println("Completed Registrar Seeding!");
    }

    // Should only ever seed registrar accounts, but not if they already exist!
    private void seedRegistrar(String userName, String firstName, String lastName) {
        UserAccount registrar = new UserAccount();
        registrar.setUserName(userName);
        registrar.setRole(UserAccount.Role.REGISTRAR);
        registrar.setPassword(passwordEncoder.encode("test123"));
        registrar.setFirstName(firstName);
        registrar.setLastName(lastName);
        registrar.setMember(true);
        registrar.setStatus(UserAccount.Status.APPROVED);

        accountRepository.save(registrar);
    }
}
